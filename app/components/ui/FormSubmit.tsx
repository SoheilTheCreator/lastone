type FormSubmitType ={
    value: string
}
//
export default function FormSubmit(props:FormSubmitType){
    return(
    <div className="w-full">
        <input 
        className="bg-[var(--button)] text-[var(--button-text)] w-full rounded-xl p-2 font-bold"
        type="submit" value={props.value}/>
    </div>)
}