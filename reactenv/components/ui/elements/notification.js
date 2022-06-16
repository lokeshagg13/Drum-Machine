import ErrorIcon from "../icons/error-icon";
import InfoIcon from "../icons/info-icon";
import SuccessIcon from "../icons/success-icon";
import classes from "./notification.module.css";

function Notification(props) {
  const { type, message } = props;
  let divClass = classes.info;
  let icon = null;
  if (type === "pending") {
    divClass = classes.info;
    icon = <InfoIcon />;
  }
  if (type === "success") {
    divClass = classes.success;
    icon = <SuccessIcon />;
  }
  if (type === "error") {
    divClass = classes.error;
    icon = <ErrorIcon />;
  }
  return (
    <div className={`${divClass} ${classes.notification}`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

export default Notification;
