'use client'
//
type FormBlockType = {
    label: string,
    type: string,
    name:string,
    placeholder?:string
}
//
export default function FormBlock(props:FormBlockType){
    return(
    <div className="my-2 flex md:flex-row flex-col justify-center items-center">
        <label  className="md:w-1/4 w-full text-right py-2"
        htmlFor={props.name}>{props.label}</label>
        <input 
        className="bg-[var(--secondary)] rounded-xl w-full p-2 border-1 border-[var(--primary)]"
        type={props.type} name={props.name} />
    </div>)
}
