export function handleLLMError(error) {
  const message = error?.message || '';

  if (
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('exceeded')
  ) {
    return {
      status: 429,
      code: 'LLM_QUOTA_EXCEEDED',
      userMessage:
        'The AI service has reached its free usage limit. Please try again later !!!.',
    };
  }

  return {
    status: 500,
    code: 'LLM_ERROR',
    userMessage:
      'Something went wrong while generating the response. Please try again.',
  };
}
