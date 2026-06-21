import style from "./Result.module.css";

export default (props: { text: string }) => {
  return <div class={style.back}>
    <div class={style.result}><span>{props.text}</span></div>
  </div>;
};
