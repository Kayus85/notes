import { Resource } from "sst";
import { Util } from "@notes/core/util";
import { ReturnValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const main = Util.handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Resource.Notes.name,
    Key: {
      // the attributes of the item to be crated
      userId: "123", // id of the author
      noteId: event?.pathParameters?.id, // the id of the note from the path
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update 
    UpdateExpression: "SET content = :content, attachment = :attachment",
    ConditionExpression: "attribute_exists(noteId)",
    ExpressionAttributeValues: {
      ":attachment": data.attachment || null,
      ":content": data.content || null,
    },
    ReturnValues: ReturnValue.ALL_NEW,

  };


  const { Attributes } = await dynamoDb.send(new UpdateCommand(params))

  return JSON.stringify(Attributes);
})
