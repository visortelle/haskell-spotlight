import s from './SectionHeader.module.css';

type PageHeaderProps = {
  text: string,
  secondaryText?: string
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className={s.container}>
      <h2 className={s.text}>{props.text}</h2>
      {props.secondaryText && <div className={s.secondaryText}>{props.secondaryText}</div>}
    </div>
  );
}

export default PageHeader;
