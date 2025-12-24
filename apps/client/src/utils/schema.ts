import {
    pick,
    type ObjectKeys,
    type ObjectIssue,
    type ObjectSchema,
    type ErrorMessage,
    type ObjectEntries,
} from "valibot";
import { concatTuples } from "@utils";
import { type ServiceType, additionalFields } from "@constants";
import { baseServiceFields, rawServiceDetailsSchema, type ServiceDetailsSchema } from "@schemas/serviceSchema";

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

export function getServiceDetailsSchema(serviceType: ServiceType): ServiceDetailsSchema {
    const keys = concatTuples(baseServiceFields, additionalFields[serviceType]);

    return pick(rawServiceDetailsSchema, keys);
}
