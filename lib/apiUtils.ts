import { ZodSchema } from "zod";

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { success: false, message: error.message };
  }
  return { success: false, message: "An unknown error occurred" };
};

export const validateData = <T>(schema: ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: result.error.errors,
    };
  }
  return { success: true, data: result.data };
};
