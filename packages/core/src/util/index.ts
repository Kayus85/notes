import { Context, APIGatewayProxyEvent } from "aws-lambda"

export module Util {
	export function handler(
		lambda: (evt: APIGatewayProxyEvent, context: Context) => Promise<string>
	) {
		// console.log("Lambda function passed to handler: " + lambda)
		// console.log("type of: " + typeof lambda)
		return async function(event: APIGatewayProxyEvent, context: Context) {
			let body: string, statusCode: number;
			// console.log("Event: " + JSON.stringify(event, null, 2));
			// console.log("Context: " + JSON.stringify(context, null, 2));
			try {
				// Run the Lambda function
				body = await lambda(event, context);
				statusCode = 200;
			} catch (error) {
				statusCode = 500;
				body = JSON.stringify({
					error: error instanceof Error ? error.message : String(error),
				});
			}

			// console.log("Body returned from lambda: " + body)

			// Return HTTP resposne
			return {
				body,
				statusCode
			};
		};
	}
}
