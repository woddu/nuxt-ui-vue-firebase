import { TableColumn } from "@nuxt/ui"
import { DocumentData } from "firebase/firestore"

export function columnCapitalize(key: string, capitalize: boolean = false): TableColumn<DocumentData> {
  return {
    accessorKey: key,
    header: key.charAt(0).toUpperCase() + key.slice(1),
    cell: ({ row }) => {      
        if (capitalize && row.getValue(key) != undefined) {
          return row.getValue<String>(key) ? row.getValue<String>(key).charAt(0).toUpperCase() + row.getValue<String>(key).slice(1) : 'N/A';
        }
        return row.getValue<String>(key) ? row.getValue<String>(key) : 'N/A';      
    }
  }
}

