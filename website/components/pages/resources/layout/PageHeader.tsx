import s from './PageHeader.module.css';

type PageHeaderProps = {
  text: string,
  secondaryText?: string
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className={s.container}>
      <h1 className={s.text}>{props.text}</h1>
      {props.secondaryText && <div className={s.secondaryText}>{props.secondaryText}</div>}
    </div>
  );
}

export default PageHeader;
