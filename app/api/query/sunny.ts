
// import * as os from 'os';

// // import * as ProgressBar from 'cli-progress';
// import * as random from 'random';
// // import * as tf from '@tensorflow/tfjs-node-gpu';
// import { QdrantClient } from '@qdrant/js-client-rest';
// import { MemorySaver } from "@langchain/langgraph";
// import { START, StateGraph, END } from "@langchain/langgraph";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
// import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
// import { ChatOllama } from "@langchain/ollama";
// import { Annotation } from "@langchain/langgraph";
// import { DocumentInterface } from "@langchain/core/documents";
// import { pipeline } from '@xenova/transformers';

// const client=new QdrantClient({url:"http://localhost:6333"})
// const model_name = "llama3.2:3b";
// const llm = new ChatOllama({
//   model: model_name,
//   temperature: 0,
// });

// const model = await pipeline('feature-extraction', 'Xenova/bge-large-en-v1.5');
// async function searchDocuments(query: string, collectionName: string = "3GPP_DATA", limit: number = 5): Promise<any[]> {
//   try {
//     // Encode the query to get an embedding
//     const queryEmbedding = await model(query, { pooling: 'mean', normalize: true });
    
//     // Convert embedding to a flat array
//     const queryVector = queryEmbedding.tolist()[0];
    
//     // Ensure embedding length matches the expected dimension
//     if (queryVector.length !== 1024) {
//       throw new Error(`Embedding size mismatch: Expected 1024, got ${queryVector.length}`);
//     }

//     // Perform search in Qdrant
//     const results = await client.search(collectionName, {
//       vector: queryVector,
//       limit,
//     });

//     return results;
//   } catch (error) {
//     console.error("Error in search:", error);
//     throw error;
//   }
// }
// const GraphState = Annotation.Root({
//   question: Annotation<string>({
//     reducer: (x, y) => y ?? x ?? "",
//   }),
//   generation: Annotation<string>({
//     reducer: (x, y) => y ?? x ?? "",
//   }),
//   rel_image: Annotation<string>({
//     reducer: (x, y) => y ?? x ?? "",
//   }),
//   chat_history: Annotation<string>({
//     reducer: (x, y) => y ?? x ?? "",
//   }),
//   web_search: Annotation<string>({
//     reducer: (x, y) => y ?? x ?? "yes",
//   }),
//   documents: Annotation<string[]>({
//     reducer: (x, y) => y ?? x ?? [],
//   }),
// });

// class RetrievalEvaluator {
//   binary_score: string;

//   constructor(binary_score: string) {
//       this.binary_score = binary_score;
//   }
// }

// async function Grade(document: string, question: string): Promise<string> {
// const gradeSystem = `
// You are a grader assessing the strict relevance of a document to a user question.
// Given a question, does the following document have exact information to answer the question? Answer yes or no only

// Example Input:
// Context: The signaling procedures in LTE involve procedures such as attach, detach, and handover between cells.
// Question: What signaling procedures are used in LTE?

// Example Output:
// yes

// Example Input:
// Context: The mobile network supports high-speed data services across various frequencies.
// Question: What are the latest advancements in LTE technology?

// Example Output:
// no

// Return strictly "yes" or "no".
// `;

// const inputText = `
// ${gradeSystem}
// Context:
// ${document}
// Question: ${question}
// `;

// const llm = new ChatOllama({ model: "llama3.2:3b", temperature: 0 });

// try {
//     // Invoke the LLM with the input text and get the response
//     const aiResponse = await llm.invoke(inputText);

//     // Parse the LLM response into the RetrievalEvaluator class
//     const evaluation = new RetrievalEvaluator(aiResponse.content.toString().trim());
    
//     // Return the binary score ('yes' or 'no')
//     return evaluation.binary_score;
// } catch (error) {
//     console.error('Error: ', error);
//     return "Error: Could not classify the response. Check LLM output.";
// }
// }




// async function relevantImages(
//   query: string
// ): Promise<{ context: string; images: string[] }> {
//   const results = await searchDocuments(query, "Images_collection_All");
//   if (!results.length) {
//     return { context: "No results found for the question.", images: [] };
//   }

//   let top3Context = "";
//   const relImages: string[] = [];

//   for (const result of results) {
//     try {
//       if (result.score > 0.65) {
//         const content = result.payload?.context || "Content not available.";
//         const imagePath = result.payload?.Imagepath || "Unknown Source";
//         relImages.push(imagePath);
//         top3Context += `Context: ${content}\n\n`;
//       }
//     } catch (error) {
//       console.error("Error during processing:", error);
//     }
//   }

//   return { context: top3Context, images: relImages };
// }

// async function retrieve(
//   state: typeof GraphState.State
// ): Promise<Partial<typeof GraphState.State>> {
//   console.log("---RETRIEVE---");
//   const question = state.question;
//   const documents = await searchDocuments(question);
//   const relevantDocs: string[] = [];
//   const { context: imageContext, images: relImages } = await relevantImages(question);

//   for (const result of documents) {
//     if (result.score > 0.65) {
//       const retrievedDoc = `
//         Use this context for Answering the Question: ${result.payload?.content || "Unknown Content"}
//         Section taken from Document - ${result.payload?.source || "Unknown Source"}
//         Document Title: ${result.payload?.document_title || "Unknown Document Title"}
//         Section Title: ${result.payload?.section_title || "Unknown Section Title"}
//         Series Subject: ${result.payload?.series_subject || "Unknown Series Subject"}
//         Working Group: ${result.payload?.working_group || "Unknown Working Group"}
//       `;
//       relevantDocs.push(retrievedDoc.trim());
//     }
//   }

//   let image: string | null = null;
//   if (relImages.length > 0) {
//     relevantDocs.push(imageContext);
//     image = relImages[0];
//   }

//   return {
//     documents: relevantDocs,
//     question: question,
//     rel_image: image as string
//   };
// }

// async function rephrasedQuery(
//   state: typeof GraphState.State
// ): Promise<Partial<typeof GraphState.State>> {
//   console.log("Running Contextualize query node!");
//   const query = state.question;
//   const history = state.chat_history || "";

//   const systemPrompt = `
//     "Given a chat history and the latest user question, which might reference prior context from the chat history,"
// "reformulate the question into a standalone query that can be understood independently, without relying on the chat history."
// "Do NOT provide an answer to the question; only return the reformulated query, or leave it as is if no changes are required."

//   ### OUTPUT FORMAT SHOULD ONLY THE BELOW ONE

//   "reformulated_query": "<question>"

  
//   please return only and only above output format
//   `;

//   const messages = [
//     new SystemMessage(systemPrompt),
//     new HumanMessage(`${history}\n${query}`)
//   ];

//   const response = await llm.invoke(messages);
//   try {
//     const content = typeof response.content === 'string' ? response.content : String(response.content);
//     console.log("Response Content:", content);
  
//     const match = content.match(/\*\*reformulated Query:\*\*\s*"([^"]*)"/);
//     console.log("Match Result:", match);
    
//     const reformulatedQuery = match?.[1] || query;
//     console.log(reformulatedQuery);
//     return {
//         question: reformulatedQuery,
//         chat_history: `Previous query: ${reformulatedQuery}`
//       };
//   } catch (error) {
//     console.error("Error processing reformulated query:", error);
//     throw new Error("Failed to extract reformulated query.");
//   }

  
// }

// async function gradeDocuments(
//   state: typeof GraphState.State
// ): Promise<Partial<typeof GraphState.State>> {
//   console.log("---CHECK DOCUMENT RELEVANCE TO QUESTION---");
//   const question = state.question;
//   const documents = state.documents;
//   const filteredDocs: string[] = [];
//   let webSearch = "yes";
//   for (const doc of documents) {
   
//     const score = await Grade(doc, question);

//     if (score.toLowerCase()=="yes") {
//       console.log("---GRADE: DOCUMENT RELEVANT---");
//       filteredDocs.push(doc);
//       webSearch = "no";
//     }
//     else continue;
//   }

//   return {
//     documents: filteredDocs,
//     question: question,
//     web_search: webSearch
//   };
// }

// async function generate(
//   state: typeof GraphState.State
// ): Promise<Partial<typeof GraphState.State>> {
//   console.log("---GENERATE---");
//   const question = state.question;
//   const documents = state.documents;

//   const systemPrompt = `You are an AI assistant specializing in 3GPP telecommunications standards. Your primary task is to provide precise and authoritative answers to user queries, using only the provided context. Your responses must be structured, concise, and include all relevant metadata fields available in the context.

// ### Response Guidelines:
// 1. **Answer:**  
//    - Provide a **clear and direct answer** strictly based on the provided context.  
//    - If the context does not contain sufficient information to answer the query, clearly state: *"The query cannot be answered due to insufficient information in the provided context."*  
//    - Do not include additional information or assumptions unless explicitly stated in the context.  

// 2. **Source Metadata:**  
//    - Always include all available metadata fields from the context in your response, formatted in a structured manner.  
//    - Include the following metadata fields, if present:  
//      - **Relevant Document Number**: [Value]  
//      - **Relevant Section Title**: [Value]  
//      - **Relevant Document Title**: [Value]  
//      - **Relevant Series Subject**: [Value]  
//      - **Relevant Working Group**: [Value]  
//    - If a specific field is unavailable, omit it without rejecting or acknowledging its absence.  
//    - Metadata provided in the context must never be excluded or rejected. If metadata is present, ensure it is incorporated into the response.  

// 3. **Strict Adherence to Source Data:**  
//    - Responses must strictly adhere to the provided context and include all relevant metadata.  
//    - Do not reference or infer backend processes, nor discuss access to the context.  

// 4. **Professional and Authoritative Style:**  
//    - Ensure responses are professional, authoritative, and concise.  
//    - Avoid disclaimers or references to limitations, except to indicate insufficient information when the context does not permit answering the query.

// By following these guidelines, provide clear, context-compliant responses that include all available metadata to ensure accuracy and completeness.


//   `;

//   const messages = [
//     new SystemMessage(systemPrompt),
//     new HumanMessage(`context: ${documents}\n\nquestion:\n${question}`)
//   ];

//   const response = await llm.invoke(messages);
  

//   return {
//     chat_history: state.chat_history + `question is ${question} \n Answer for it is : ${response} \n\n`,
//     documents: documents,
//     question: question,
//     generation: response.content as string,
//     rel_image: state.rel_image,
//   };
// }


// async function Internal(
//     state: typeof GraphState.State
//   ): Promise<Partial<typeof GraphState.State>> {
//     console.log("---WEB SEARCH---");
  
//     const question = state.question;
//     const documents = state.documents;
  
//     const systemPrompt = `
//          """You are a highly knowledgeable telecom domain expert specializing in network troubleshooting, quality assurance, and telecommunications standards. Your expertise includes key telecom concepts such as protocols, network functions, interfaces, specifications, performance metrics, and troubleshooting processes for 3G, 4G, 5G, and emerging telecom technologies.

// Your role is to assist users by:
// 1. Providing accurate and practical answers to queries about network issues, standards, and quality assurance.
// 2. Referring to relevant 3GPP or other telecom-related documents, their titles, and context when applicable, quoting specific paragraphs to support your response.

// ### Response Rules:
// 1. **Confident Answers Only:** Respond only if you are confident and have sufficient knowledge to provide a clear, correct answer.
// 2. **Reference Supporting Documentation:**
//    - Mention relevant document numbers (e.g., TS 23.501, TS 38.300), titles, and summaries.
//    - Quote specific paragraphs or sections if they directly address the query.
// 3. **No Guessing:** If you are unsure or lack sufficient information, respond only with "NO."
// 4. **Straightforward Responses:** Provide concise and professional answers without unnecessary elaboration.



// ### Additional Notes:
// When referring to documents:
// - Always mention the document number, title, and a brief summary of its context.
// - If quoting a section or paragraph, ensure accuracy by explicitly referencing the section number or title.
// - Respond concisely and only include relevant details.

// Begin by analyzing the user's query. Provide an accurate response with supporting references if possible, or respond with "NO" if unsure.

// """
//     `;
  
//     const messages = [
//       new SystemMessage(systemPrompt),
//       new HumanMessage(`question: ${question}`)
//     ];
  
//     try {
//       const response = await llm.invoke(messages);
//       const llmResults = response.content as string;
  
//       // Assuming documents is an array of strings
//       const newDocuments = [...documents, llmResults];
  
//       return {
//         documents: newDocuments,
//         question: question
//       };
//     } catch (error) {
//       console.error("Error during LLM invocation:", error);
//       throw new Error("Failed to perform web search.");
//     }
//   }

//   function decideToGenerate(
//     state: typeof GraphState.State
//   ): "Internal" | "generate" {
//     console.log("---ASSESS GRADED DOCUMENTS---");
//     const webSearch = state.web_search;
  
//     if (webSearch === "yes") {
//       console.log("---DECISION: TRANSFORM QUERY---");
//       return "Internal";
//     } else {
//       console.log("---DECISION: GENERATE---");
//       return "generate";
//     }
//   }

// // Workflow definition
// const workflow = new StateGraph(GraphState)
//   .addNode("Contextualize_query", rephrasedQuery)
//   .addNode("retrieve", retrieve)
//   .addNode("gradeDocuments", gradeDocuments)
//   .addNode("generate", generate)
//   .addNode("Internal_Knowledge", Internal);

// // workflow.setEntryPoint("Contextualize_query");
// workflow.addEdge(START,"Contextualize_query");
// workflow.addEdge("Contextualize_query", "retrieve");
// workflow.addEdge("retrieve", "gradeDocuments");
// workflow.addConditionalEdges(
//   "gradeDocuments",
//   decideToGenerate,
//   {
//     Internal: "Internal_Knowledge",
//     generate: "generate",
//   }
// );
// workflow.addEdge("Internal_Knowledge", "generate");
// workflow.addEdge("generate", END);
// const memory = new MemorySaver();
// const app = workflow.compile({ checkpointer: memory });
// // Class definition to classify if a question is telecom-related
// class GeneralQuestion {
//   binary_score: string;

//   constructor(binary_score: string) {
//     if (!["yes", "no"].includes(binary_score.toLowerCase())) {
//       throw new Error(
//         "Invalid binary_score: must be 'yes' or 'no'. Received: " + binary_score
//       );
//     }
//     this.binary_score = binary_score.toLowerCase();
//   }
// }

// // Function to classify and answer questions
// async function generalQA(query: string): Promise<string> {
//   const generalModel = new ChatOllama({ model: "llama3.2:3b", temperature: 0 });
//   const assistant = `You are an AI assistant. Give a direct answer to the user's question.`;
//   const systemPrompt = `
//     You are an expert in telecommunications. Respond with "YES" if the user's query is related to telecom topics 
//     (such as network issues, protocols, standards, specifications, troubleshooting, 3G, 4G, 5G, or any other telecom-related concepts). 
//     Respond with "NO" for any other general or unrelated queries that are not telecom-related. Your answers must be strict and clear.

//     Query: {user_query}
//     Response:
//   `;

//   // Prepare the input text for the LLM
 
//   // Default evaluation value
//   let response: string = "";
  
//   try {
//     const messages = [
//       new SystemMessage(systemPrompt),
//       new HumanMessage(`question: ${query}`)
//     ];
//     // Invoke the LLM to classify the question
//     const aiResponse = await generalModel.invoke(messages);
//     const aiResponseContent = aiResponse.content.toString().trim().toLowerCase();
//     // Instantiate GeneralQuestion with the LLM response
//     const evaluation = new GeneralQuestion(aiResponseContent);
  
//     // If the question is not telecom-related, ask the assistant to answer it directly
//     if (evaluation.binary_score == "no") {
     
//       const messages = [
//         new SystemMessage(assistant),
//         new HumanMessage(`question: ${query}`)
//       ];
//       // Invoke the LLM for the direct answer
//       const res = await generalModel.invoke(messages );
//       response = res.content.toString().trim();
//       return response;
//     }
    
//     return "yes" ;
//   } catch (error) {
//     console.error("Error in generalQA function:", error);
//     return  "Could not classify the response. Check LLM output." ;
//   }
// }
// async function runGraph(query: string, id: string): Promise<{ response: string; image: string | null }> {
//   const config = {
//     configurable: { thread_id: id },
//   };

//   try {
//     // Check if the query is telecom-related
//     const qaResult = await generalQA(query); // Await the result of generalQA
//     if (qaResult !== "yes") {
//       return { response: qaResult, image: null }; // Return non-telecom-related response
//     }

//     // Fetch memory state and invoke the app for telecom-related queries
//     const memoryState = await app.getState(config);
//     console.log(`State: ${JSON.stringify(memoryState)}`);

//     const result = await app.invoke({ question: query }, config);

//     // Return the processed result and related image (if any)
//     return {
//       response: result.generation.substring(11),
//       image: result.rel_image || null,
//     };
//   } catch (error) {
//     console.error("Error in runGraph function:", error);
//     throw new Error("Failed to execute runGraph.");
//   }
// }
// function generateUniqueId(existingIds: Set<number>): number {
//   let randomId: number;
//   do {
//     randomId = Math.floor(Math.random() * 1000);
//   } while (existingIds.has(randomId));
//   existingIds.add(randomId);
//   return randomId;
// }

// const existingIds = new Set<number>();

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { question: query } = body;
//   const chat_history = body.chat_history;
//   console.log(chat_history);

//   if (!query) {
//     return NextResponse.json({ error: "Please provide a question" }, { status: 400 });
//   }

//   const encoder = new TextEncoder();
//   const stream = new TransformStream();
//   const writer = stream.writable.getWriter();

//   const sendUpdate = async (data: string) => {
//     await writer.write(encoder.encode(`data: ${JSON.stringify({ message: data })}\n\n`));
//   };

//   const processQuery = async () => {
//     try {
//       await sendUpdate("Initializing AI models...");
//       const id = generateUniqueId(existingIds);
//       const result = await runGraph(query, id.toString());

//       if (!result.response) {
//         return new Response();
//       }

//       const images = result.image;

//       await sendUpdate(
//         JSON.stringify({
//           documents: result.response,
//           imageData: images,
//           done: true,
//         })
//       );
//     } catch (error) {
//       console.error(error);
//       await sendUpdate(
//         JSON.stringify({
//           error: "An error occurred while processing your request.",
//         })
//       );
//     } finally {
//       writer.close();
//     }
//   };

//   processQuery();

//   return new Response(stream.readable, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }
