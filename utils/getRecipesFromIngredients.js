import { get } from 'http';
import dotenv from 'dotenv';
dotenv.config();
require("dotenv").config(); 
const { request, gql } = require("graphql-request");

const endpoint = "https://production.suggestic.com/graphql";
const apiKey = process.env.NEXT_PUBLIC_SUGGESTIC_API_KEY;

export const getRecipesFromIngredients = async (mustIngredients) => {

    if (!apiKey) {
    throw new Error("API Key is missing. Check your .env file.");
  }

  const query = gql`query foo($mustIngredients: [String!]!) {
      searchRecipesByIngredients(mustIngredients: $mustIngredients) {
        edges {
          node {
            name
            ingredients { name }
            ingredientLines
          }
        }
      }
    }
  `;

  const variables = { mustIngredients };

  const response = await fetch("https://production.suggestic.com/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${apiKey}`,
    },
    body: JSON.stringify({
        query: query,
        variables: variables,
    }),
});

const data = await response.json();
if (response.ok) {
    return data.data;
} else {
    throw new Error("Failed to fetch recipes");
}
};