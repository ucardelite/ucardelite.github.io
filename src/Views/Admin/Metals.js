import Button from "Components/Button";
import ResourceCard from "Components/ResourceCard";
import { useObjectVal } from "react-firebase-hooks/database";
import { getDbRef, updateDB } from "Helper/firebase";
import { v4 as uuidv4 } from "uuid";
import Confirm from "Components/Confirm";

const addEmptyMetal = () => {
  const id = uuidv4();
  const updates = {};
  updates["metals/" + id] = { image: "empty", price: "empty", qty: "empty", id };
  updateDB(updates);
};

const deleteMetal = async (id) => {
  const res = await Confirm();
  if (res) {
    const updates = {};
    updates["metals/" + id] = null;
    updateDB(updates);
  }
};

const updateMetal = (id) => (values) => {
  const updates = {};
  updates["metals/" + id] = values;
  updateDB(updates);
};

const Metals = () => {
  const [metals, loading] = useObjectVal(getDbRef("metals"));

  const resources = metals ? metals : {};

  return loading ? (
    <div className="m-auto text-white">Loading...</div>
  ) : (
    <div className="w-100">
      <div className="d-flex justify-content-between flex-wrap align-items-center mb-5">
        <div className="admin-page-title">Metals</div>
        <div style={{ maxWidth: 141, width: "100%" }}>
          <Button
            onClick={() => {
              if (!Object.values(resources).filter((x) => x.image === "empty").length) {
                addEmptyMetal();
              }
            }}
          >
            ADD NEW
          </Button>
        </div>
      </div>
      <div className="resources-container pb-5" style={{ maxWidth: 800 }}>
        {Object.keys(resources)
          .sort((a, b) => (resources[a].image === "empty" ? -1 : 1))
          .map((x, i) => (
            <ResourceCard
              onDelete={() => deleteMetal(x)}
              onUpdate={updateMetal(x)}
              resource={resources[x]}
              key={`metal-resource-${x}`}
            ></ResourceCard>
          ))}
      </div>
    </div>
  );
};

export default Metals;
