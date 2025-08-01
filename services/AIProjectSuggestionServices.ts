import { GetSecretKey } from "@/utils/GetSecretKey";

export const AIProjectSuggestionServices = async (projects: {
  name: string;
  description: string;
}) => {
  try {
    const keys = await GetSecretKey();
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mixtral-8x7b-instruct-v0.1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${keys.HUGGINGFACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Suggest a list of tasks for a project named "${projects.name}" with the following description: "${projects.description || ''}". Provide tasks in a concise list format.`,
          parameters: {
            max_new_tokens: 200,
            return_full_text: false,
          },
        }),
      }
    );

    const data: any = response.json();
    if (data && data[0]?.generated_text) {
      const tasks = data[0].generated_text
        .split('\n')
        .filter((task: any) => task.trim());
      return tasks;
    }

    throw new Error('No Tasks Generated');
  } catch (error) {
    console.error('HuggingChat error:', error);
    return [
      `Design ${projects.name} UI`,
      `Develop ${projects.name} Backend`,
      `Test ${projects.name} Features`,
      `Deploy ${projects.name}`,
    ];
  }
};
