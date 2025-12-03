import { GoogleGenAI, Type } from "@google/genai";
import { ViralAnalysis, VideoIdea, GeneratedScript } from "../types";

// System instruction for the "Persona"
const SYSTEM_INSTRUCTION = `
당신은 세계 최고의 유튜브 콘텐츠 전략가이자 전문 스크립트 작가입니다. 
한국어로 소통하며, 인기 동영상의 성공 요인을 분석하고 그것을 기반으로 새로운 떡상 콘텐츠를 기획하는 능력이 탁월합니다.
항상 트렌디하고, 자극적이며, 시청 지속 시간을 극대화하는 방향으로 생각하십시오.
`;

// API key management
let currentApiKey: string = '';

export const setApiKey = (apiKey: string) => {
  currentApiKey = apiKey;
};

const getAI = () => {
  if (!currentApiKey) {
    throw new Error('API 키가 설정되지 않았습니다. 설정 버튼을 클릭하여 API 키를 입력해주세요.');
  }
  return new GoogleGenAI({ apiKey: currentApiKey });
};

export const analyzeTranscript = async (transcript: string): Promise<ViralAnalysis> => {
  const prompt = `
  다음은 유튜브에서 큰 인기를 끈 영상의 대본입니다. 이 대본을 분석하여 왜 성공했는지 '성공 공식'을 추출해 주세요.
  다음 항목들을 분석해 JSON 형식으로 반환해 주세요:
  
  1. hookStrategy: 초반 5-10초에 시청자를 사로잡은 핵심 전략 (한 문장).
  2. retentionTactics: 시청 이탈을 막기 위해 사용된 장치들 (3개 이하의 문자열 배열).
  3. emotionalTriggers: 자극된 주요 감정들 (예: 호기심, 분노, 공감 등) (배열).
  4. structureBreakdown: 서론-본론-결론의 흐름과 템포에 대한 요약.
  5. viralFactor: 이 영상이 알고리즘의 선택을 받은 결정적인 '떡상 요인' 한 가지.
  6. toneStyle: 화자의 톤, 말투, 영상의 분위기.

  대본:
  ${transcript.substring(0, 15000)} (길면 자름)
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hookStrategy: { type: Type.STRING },
          retentionTactics: { type: Type.ARRAY, items: { type: Type.STRING } },
          emotionalTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
          structureBreakdown: { type: Type.STRING },
          viralFactor: { type: Type.STRING },
          toneStyle: { type: Type.STRING },
        },
        required: ["hookStrategy", "retentionTactics", "emotionalTriggers", "structureBreakdown", "viralFactor", "toneStyle"],
      }
    }
  });

  if (!response.text) throw new Error("No analysis returned");
  return JSON.parse(response.text) as ViralAnalysis;
};

export const generateIdeas = async (analysis: ViralAnalysis, originalTranscript: string): Promise<VideoIdea[]> => {
  const prompt = `
  우리가 방금 분석한 인기 영상의 성공 공식(Analysis)을 바탕으로, 
  완전히 새로운 주제의 유튜브 영상 아이디어 4가지를 제안해 주세요.
  
  분석된 성공 공식:
  ${JSON.stringify(analysis)}

  원래 대본의 주제와는 다르지만, 동일한 '구조적 재미'와 '몰입감'을 줄 수 있는 아이디어여야 합니다.
  
  각 아이디어는 다음 필드를 가집니다:
  1. title: 클릭을 유도하는 자극적이고 매력적인 썸네일용 제목.
  2. premise: 영상의 핵심 내용과 기획 의도.
  3. targetAudience: 주 타겟 시청층.
  4. predictedViralScore: 예상되는 떡상 지수 (1-100 사이 숫자).
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            premise: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            predictedViralScore: { type: Type.NUMBER },
          },
          required: ["title", "premise", "targetAudience", "predictedViralScore"],
        }
      }
    }
  });

  if (!response.text) throw new Error("No ideas returned");
  return JSON.parse(response.text) as VideoIdea[];
};

export const generateScript = async (idea: VideoIdea, analysis: ViralAnalysis): Promise<GeneratedScript> => {
  const prompt = `
  당신이 제안한 아이디어 "${idea.title}"를 바탕으로 실제 유튜브 촬영용 대본을 작성해 주세요.
  가장 중요한 것은 앞서 분석한 성공 공식(Analysis)의 구조, 톤앤매너, 훅 전략을 그대로 적용하는 것입니다.
  
  분석된 성공 스타일:
  ${JSON.stringify(analysis)}
  
  아이디어 정보:
  ${JSON.stringify(idea)}
  
  대본은 JSON 형식으로 반환해야 하며, 각 섹션(서론, 본론1, 본론2, 결론 등)으로 나누어 주세요.
  각 섹션은 heading(소제목), content(실제 대사), visualCue(화면 연출 지시문)를 포함합니다.
  대사는 구어체로 아주 자연스럽게 작성하세요.
  `;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heading: { type: Type.STRING },
                content: { type: Type.STRING },
                visualCue: { type: Type.STRING },
              },
              required: ["heading", "content", "visualCue"]
            }
          }
        },
        required: ["title", "sections"]
      }
    }
  });

  if (!response.text) throw new Error("No script returned");
  return JSON.parse(response.text) as GeneratedScript;
};
