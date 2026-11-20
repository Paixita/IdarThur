// Respaldo del chat cuando el proveedor limita temporalmente el modelo principal.
export async function generateChatWithFallback(generate, options, fallbackModel) {
 try { return await generate(options); }
 catch(error) {
  if(![429,502,503].includes(error?.statusCode))throw error;
  return generate({...options,model:fallbackModel,maxRetries:0,
   providerOptions:{groq:{reasoningEffort:'low'}}});
 }
}
