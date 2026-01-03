import { z } from "zod";

// Ingredient validations
export const ingredientSchema = z.object({
  name: z.string().min(1, "재료 이름을 입력해주세요").max(100),
  category: z.string().max(50).nullable().optional(),
});

export type IngredientInput = z.infer<typeof ingredientSchema>;

// Recipe ingredient validation
export const recipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, "재료를 선택해주세요"),
  quantity: z.number().positive("수량은 0보다 커야 합니다"),
  unit: z.string().min(1, "단위를 입력해주세요"),
});

// Recipe validations
export const recipeSchema = z.object({
  title: z.string().min(1, "레시피 제목을 입력해주세요").max(200),
  description: z.string().max(1000).nullable().optional(),
  steps: z.array(z.string().min(1)).min(1, "최소 1개의 조리 단계가 필요합니다"),
  time: z.number().int().positive("조리 시간은 0보다 커야 합니다"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tips: z.string().max(1000).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  ingredients: z.array(recipeIngredientSchema).min(1, "최소 1개의 재료가 필요합니다"),
});

export type RecipeInput = z.infer<typeof recipeSchema>;

// Update schemas (partial)
export const ingredientUpdateSchema = ingredientSchema.partial();
export const recipeUpdateSchema = recipeSchema.partial();
