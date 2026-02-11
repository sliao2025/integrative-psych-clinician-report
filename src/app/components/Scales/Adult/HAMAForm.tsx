import { SetAActions } from "../../../lib/types";
import Field from "../../primitives/Field";
import Likert from "../../primitives/Likert";
import { HAM_A_QUESTIONS, HAM_A_OPTIONS, HAM_A_DESCRIPTIONS } from "../../text";

export default function HAMAForm({ a, setA }: { a: any; setA: SetAActions }) {
  return (
    <div className="grid md:grid-cols-1 gap-4">
      {Object.entries(HAM_A_QUESTIONS).map(([key, text]) => {
        const options = HAM_A_OPTIONS[key] || HAM_A_OPTIONS.default || [];
        const description = HAM_A_DESCRIPTIONS[key];

        return (
          <Field key={key} title={text} description={description}>
            <Likert
              value={a?.hama?.[key] || ""}
              onChange={(v) =>
                setA((n) => {
                  const data = n.assessments.data as any;
                  if (!data.hama) data.hama = {};
                  data.hama[key] = String(v);
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
