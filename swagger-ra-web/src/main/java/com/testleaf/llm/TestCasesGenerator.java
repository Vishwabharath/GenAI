package com.testleaf.llm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

@Service
public class TestCasesGenerator {

    /**
     * Extract the Java code from the LLM's response JSON.
     */
    public String extractTestCases(String llmResponse) {
        String output = null;
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(llmResponse);
            JsonNode choicesNode = rootNode.path("choices");
            if (choicesNode.isArray() && choicesNode.size() > 0) {
                JsonNode messageNode = choicesNode.get(0).path("message");
                String content = messageNode.path("content").asText().trim();
                output = content.replaceAll("<think>[\\s\\S]*?</think>\n*", "");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return output;
    }

}
