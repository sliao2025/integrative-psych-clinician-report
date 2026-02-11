import { SetAActions } from "../../../lib/types";
import Field from "../../primitives/Field";
import Likert from "../../primitives/Likert";
import { BPRS_QUESTIONS, BPRS_OPTIONS, BPRS_DESCRIPTIONS } from "../../text";

export default function BPRSForm({ a, setA }: { a: any; setA: SetAActions }) {
  return (
    <div className="grid md:grid-cols-1 gap-4">
      {Object.entries(BPRS_QUESTIONS).map(([key, text]) => {
        const options = BPRS_OPTIONS[key] || BPRS_OPTIONS.default || [];
        const description = BPRS_DESCRIPTIONS[key];

        return (
          <Field key={key} title={text} description={description}>
            <Likert
              value={a?.bprs?.[key] || ""}
              onChange={(v) =>
                setA((n) => {
                  const data = n.assessments.data as any;
                  if (!data.bprs) data.bprs = {};
                  data.bprs[key] = String(v);
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
