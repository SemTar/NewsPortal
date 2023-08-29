import { MessagesBagContract, ErrorReporterContract } from '@ioc:Adonis/Core/Validator'
import ValidationError from 'App/Errors/ValidationError'

/**
 * The shape of an individual error
 */
type ErrorNode = {
  message: string
  field: string
  rule: string
}

export class MyReporter implements ErrorReporterContract<{ errors: ErrorNode[] }> {
  public hasErrors = false

  /**
   * Tracking reported errors
   */
  private errors: ErrorNode[] = []

  constructor(private messages: MessagesBagContract, private bail: boolean) {}

  /**
   * Invoked by the validation rules to
   * report the error
   */
  public report(
    pointer: string,
    rule: string,
    message: string,
    arrayExpressionPointer?: string,
    args?: any
  ) {
    /**
     * Turn on the flag
     */
    this.hasErrors = true

    /**
     * Use messages bag to get the error message. The messages
     * bag also checks for the user-defined error messages and
     * hence must always be used
     */
    const errorMessage = this.messages.get(pointer, rule, message, arrayExpressionPointer, args)

    /**
     * Track error message
     */
    this.errors.push({ message: errorMessage, field: pointer, rule: rule })

    /**
     * Bail mode means stop validation on the first
     * error itself
     */
    if (this.bail) {
      throw this.toError()
    }
  }

  /**
   * Converts validation failures to an exception
   */
  public toError() {
    throw new ValidationError(this.errors)
  }

  /**
   * Get error messages as JSON
   */
  public toJSON() {
    return {
      errors: this.errors,
    }
  }
}
