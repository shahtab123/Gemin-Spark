// Create a simplified version of ascii-table3 for our needs
const AsciiTable3 = {
  formatTable(headers, rows) {
    const columnWidths = headers.map((header, index) => {
      const cellLengths = rows.map(row => String(row[index]).length);
      return Math.max(String(header).length, ...cellLengths);
    });

    // Create top border
    let table = '┌' + columnWidths.map(w => '─'.repeat(w + 2)).join('┬') + '┐\n';

    // Add headers
    table += '│ ' + headers.map((header, i) => 
      String(header).padEnd(columnWidths[i])
    ).join(' │ ') + ' │\n';

    // Add separator
    table += '├' + columnWidths.map(w => '─'.repeat(w + 2)).join('┼') + '┤\n';

    // Add rows
    rows.forEach(row => {
      table += '│ ' + row.map((cell, i) => 
        String(cell).padEnd(columnWidths[i])
      ).join(' │ ') + ' │\n';
    });

    // Add bottom border
    table += '└' + columnWidths.map(w => '─'.repeat(w + 2)).join('┴') + '┘\n';

    return table;
  }
};

export { AsciiTable3 }; 