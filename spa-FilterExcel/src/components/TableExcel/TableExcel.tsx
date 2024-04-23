import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { ArrowDown } from "react-bootstrap-icons";
import { ContainerData, InputFile, InputSearch } from "./TableExcelStyled";

interface Row {
  [key: string]: string | number;
}

const TableExcel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [data, setData] = useState<Row[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const data = e.target.result.toString();
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet) as Row[];
      setData(parsedData);
      setShowSearch(true); // Mostrar campo de pesquisa após o upload do arquivo
    };
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <span>
        Coloque seu arquivo abaixo <ArrowDown size={15} />
      </span>
      <InputFile
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
      {showSearch && (
        <InputSearch
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      )}
      <ContainerData
        style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(100px))` }}
      >
        {filteredData.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ContainerData>
    </>
  );
};

export default TableExcel;
