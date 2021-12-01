import Components from "@modules/components";
import FormItem from "./formitem"

export default function RadioGroup({children: title, note, required, ...props}) {
    const RadioGroup = Components.get("RadioGroup");

    return (
        <FormItem title={title} note={note} required={required}>
            <RadioGroup {...props} />
        </FormItem>
    );
};