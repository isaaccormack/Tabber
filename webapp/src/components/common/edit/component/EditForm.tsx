import React from "react";
import {useForm} from "react-hook-form";

interface EditFormProps {
    onSubmit: Function
}

export interface LickFormInterface {
    lickname: string
    lickdescription: string
    licktuning: string
    lickpublic: boolean
}

export default function EditForm(props: EditFormProps) {
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data: any) => props.onSubmit(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            Lick name
            <br />
            <input name="lickname" ref={register({ required: true })} />
            {errors.lickname && <span>This field is required</span>}
            <br/>
            Description
            <br/>
            <input name="lickdescription" ref={register} />
            <br/>
            Tuning
            <br/>
            <input name="licktuning" ref={register} />
            <br/>
            Public
            <br/>
            <input type="checkbox" name="lickpublic" ref={register} />
            <br/>
            <input type="submit" />
        </form>
    )
}
