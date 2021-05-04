import Button from "Components/Button";
import DiscountCard from "Components/DiscountCard";
import { useObjectVal } from "react-firebase-hooks/database";
import { getDbRef, updateDB } from "Helper/firebase";
import { v4 as uuidv4 } from "uuid";
import Confirm from "Components/Confirm";

const addEmptyDiscount = () => {
  const id = uuidv4();
  const updates = {};
  updates["discounts/" + id] = { code: "empty", discount: "empty", start: "empty", end: "empty" };
  updateDB(updates);
};

const deleteDiscount = async (id) => {
  const res = await Confirm();
  if (res) {
    const updates = {};
    updates["discounts/" + id] = null;
    updateDB(updates);
  }
};

const updateDiscount = (id) => (values) => {
  const updates = {};
  updates["discounts/" + id] = values;
  updateDB(updates);
};

const Discounts = () => {
  const [discountsObjVal, loading] = useObjectVal(getDbRef("discounts"));

  const discounts = discountsObjVal ? discountsObjVal : {};

  return loading ? (
    <div className="m-auto text-white">Loading...</div>
  ) : (
    <div className="w-100">
      <div className="d-flex justify-content-between flex-wrap align-items-center mb-5">
        <div className="admin-page-title">Discounts</div>
        <div style={{ maxWidth: 141, width: "100%" }}>
          <Button
            onClick={() => {
              if (!Object.values(discounts).filter((x) => x.code === "empty").length) {
                addEmptyDiscount();
              }
            }}
          >
            ADD NEW
          </Button>
        </div>
      </div>
      <div className="discounts-container pb-5" style={{ maxWidth: 800 }}>
        {Object.keys(discounts)
          .sort((a, b) => (discounts[a].code === "empty" ? -1 : 1))
          .map((x, i) => (
            <DiscountCard
              onDelete={() => deleteDiscount(x)}
              onUpdate={updateDiscount(x)}
              discount={discounts[x]}
              key={`discount-${x}`}
            ></DiscountCard>
          ))}
      </div>
    </div>
  );
};

export default Discounts;
