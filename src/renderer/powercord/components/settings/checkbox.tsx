import Components from "@modules/components";
import FormItem from "./formitem"

export default function Checkbox({children: title, note, required, ...props}) {
    const Checkbox = Components.get("Checkbox");

    return (
        <FormItem title={title} note={note} required={required}>
            <Checkbox {...props} />
        </FormItem>
    );
};