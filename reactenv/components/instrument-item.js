import Image from "next/image";

import classes from "./instrument-item.module.css";

function InstrumentItem(props) {
  const { name, image } = props;
  console.log(name)
  return (
    <button className={classes.instrument}>
      <div className={classes.name}>{name}</div>
      <div className={classes.image}>
        <Image src={image} alt="" width="32" height="32" />
      </div>
    </button>
  );
}

export default InstrumentItem;
