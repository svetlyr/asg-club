import { type ObjectSchema, type ErrorMessage, type ObjectEntries, type ObjectIssue, type ObjectKeys } from "valibot";

/*
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    * Non-numeric keys are returned in the order they are defined in the object.
*/
function getTypedSchemaKeys<TEntries extends ObjectEntries, TPipeline extends ErrorMessage<ObjectIssue> | undefined>(
    schema: ObjectSchema<TEntries, TPipeline>,
): ObjectKeys<typeof schema> {
    return Object.keys(schema.entries) as ObjectKeys<typeof schema>;
}

export { getTypedSchemaKeys };
