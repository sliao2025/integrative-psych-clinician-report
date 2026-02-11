import { SetAActions } from "../../../lib/types";
import Field from "../../primitives/Field";
import Likert from "../../primitives/Likert";
import { HAM_D_QUESTIONS, HAM_D_OPTIONS } from "../../text";

export default function HAMDForm({ a, setA }: { a: any; setA: SetAActions }) {
  return (
    <div className="grid md:grid-cols-1 gap-4">
      {Object.entries(HAM_D_QUESTIONS).map(([key, text]) => {
        const options = HAM_D_OPTIONS[key] || [];

        return (
          <Field key={key} title={text}>
            <Likert
              value={a?.hamd?.[key] || ""}
              onChange={(v) =>
                setA((n) => {
                  const data = n.assessments.data as any;
                  if (!data.hamd) data.hamd = {};
                  data.hamd[key] = String(v);
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
