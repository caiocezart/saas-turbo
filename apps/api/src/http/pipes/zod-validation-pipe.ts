import { PipeTransform, BadRequestException, Logger } from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private schema: ZodSchema) {
    // this.logger.debug("ZodValidationPipe constructor:", schema);
  }

  transform(value: unknown) {
    try {
      // this.logger.debug("ZodValidationPipe transform:", value);
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: "Validation failed",
          statusCode: 400,
          errors: fromZodError(error),
        });
      }

      throw new BadRequestException("Validation failed");
    }
  }
}
