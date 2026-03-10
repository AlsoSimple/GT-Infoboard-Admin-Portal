import style from "./button.module.scss";

interface ButtonInterface {
  textValue: string;
}
// ButtonInterFace Componenet
export function Button({ textValue }: ButtonInterface) {
  return <button className={style.minButton}>{textValue}</button>;
}
