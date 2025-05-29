import ErrorIcon from "../icons/errorIcon";
import InfoIcon from "../icons/infoIcon";
import SuccessIcon from "../icons/successIcon";
import "./notification.css";

function Notification(props) {
  const { type, message } = props;
  let divClass = "info";
  let icon = null;
  if (type === "pending") {
    divClass = "info";
    icon = <InfoIcon />;
  }
  if (type === "success") {
    divClass = "success";
    icon = <SuccessIcon />;
  }
  if (type === "error") {
    divClass = "error";
    icon = <ErrorIcon />;
  }
  return (
    <div className={`${divClass} notification`}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}

export default Notification;
