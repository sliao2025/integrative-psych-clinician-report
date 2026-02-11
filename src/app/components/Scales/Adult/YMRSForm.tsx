import { SetAActions } from "../../../lib/types";
import Field from "../../primitives/Field";
import Likert from "../../primitives/Likert";
import { YMRS_QUESTIONS, YMRS_OPTIONS } from "../../text";

export default function YMRSForm({ a, setA }: { a: any; setA: SetAActions }) {
  return (
    <div className="grid md:grid-cols-1 gap-4">
      {Object.entries(YMRS_QUESTIONS).map(([key, text]) => {
        const options = YMRS_OPTIONS[key] || [];

        return (
          <Field key={key} title={text}>
            <Likert
              value={a?.ymrs?.[key] || ""}
              onChange={(v) =>
                setA((n) => {
                  const data = n.assessments.data as any;
                  if (!data.ymrs) data.ymrs = {};
                  data.ymrs[key] = String(v);
                })
              }
              options={options}
            />
          </Field>
        );
      })}
    </div>
  );
}
