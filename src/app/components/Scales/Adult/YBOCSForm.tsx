import { SetAActions } from "../../../lib/types";
import Field from "../../primitives/Field";
import Likert from "../../primitives/Likert";
import { YBOCS_QUESTIONS, YBOCS_OPTIONS } from "../../text";

export default function YBOCSForm({ a, setA }: { a: any; setA: SetAActions }) {
  return (
    <div className="grid md:grid-cols-1 gap-4">
      {Object.entries(YBOCS_QUESTIONS).map(([key, text]) => {
        const options = YBOCS_OPTIONS[key] || [];

        return (
          <Field key={key} title={text}>
            <Likert
              value={a?.ybocs?.[key] || ""}
              onChange={(v) =>
                setA((n) => {
                  const data = n.assessments.data as any;
                  if (!data.ybocs) data.ybocs = {};
                  data.ybocs[key] = String(v);
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
