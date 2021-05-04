import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css";
import Modal from "@material-ui/core/Modal";
import { useState } from "react";

const DayPickerComponent = ({ value, setValue, children, disabled = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal open={open}>
        <div className="d-flex w-100 h-100 overflow-auto" onClick={() => setOpen(false)}>
          <div className="d-inline-block bg-white m-auto" onClick={(e) => e.stopPropagation()}>
            <style>{`.DayPicker-Day{width: 40px; height: 40px;} .DayPicker-Day:hover {
              background-color: #ffbd1b !important;
              color: black;
            }`}</style>
            <DayPicker
              modifiersStyles={{
                selected: {
                  background: "#ffbd1b",
                },
                today: { color: "black" },
              }}
              selectedDays={[value]}
              onDayClick={(newValue) => {
                setValue(newValue);
                setOpen(false);
              }}
            />
          </div>
        </div>
      </Modal>
      <div onClick={() => setOpen(disabled ? false : true)}>{children}</div>
    </>
  );
};

export default DayPickerComponent;
