import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

export const EditorialTable = Table.configure({
  resizable: false,
  renderWrapper: true,
  HTMLAttributes: {
    class: 'studio-editorial-table',
  },
});

export const EditorialTableRow = TableRow.configure({
  HTMLAttributes: {
    class: 'studio-editorial-table-row',
  },
});

export const EditorialTableHeader = TableHeader.configure({
  HTMLAttributes: {
    class: 'studio-editorial-table-header',
  },
});

export const EditorialTableCell = TableCell.configure({
  HTMLAttributes: {
    class: 'studio-editorial-table-cell',
  },
});

export { Table, TableRow, TableHeader, TableCell };
