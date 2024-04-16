import { useState } from "react";
import * as XLSX from "xlsx";
import { ContainerData, ContainerHome, InputFile } from "./HomeStyled";

export default function Home() {


    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    const handleFileUpload = (e) => {
      const reader = new FileReader();
      reader.readAsBinaryString(e.target.files[0]);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);
          
        setData(parsedData);
        };
        


    }

    
    const filteredData = data.filter((row) =>
        Object.values(row).some(
          (value) =>
            typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
  

    return (
      
        <>
            <ContainerHome>

        <InputFile 
          type="file" 
          accept=".xlsx, .xls" 
          onChange={handleFileUpload} 
        />

<input
  type="text"
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>


                <ContainerData>

                
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
  </ContainerHome>
     
      </>
   
  )
}
