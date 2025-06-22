Sub UpdateSubGroup()
    Dim srcRange As Range
    Dim destRange As Range
    Dim tbl As ListObject
    Dim cell As Range
    Dim lines() As String
    Dim result As String
    Dim line As Variant
    Dim tblRow As ListRow

    ' Set the ranges using named ranges
    Set srcRange = ThisWorkbook.Names("Groups").RefersToRange
    Set destRange = ThisWorkbook.Names("Sub_Group").RefersToRange
    ' Set the table reference
    Set tbl = ThisWorkbook.Sheets("Glossary").ListObjects("Table2")

    ' Clear the destination range before writing new values
    destRange.ClearContents

    ' Loop through each cell in the source range
    For Each cell In srcRange
        ' Initialize the result string for the current cell
        result = ""
        
        ' Split the cell text into lines
        lines = Split(cell.Value, Chr(10)) ' Chr(10) is the line feed character
        
        ' Loop through each line
        For Each line In lines
            ' Loop through each row in the table
            For Each tblRow In tbl.ListRows
                ' Check if the line matches the value in the second column of the table
                If Trim(line) = Trim(tblRow.Range.Cells(1, 2).Value) Then
                    ' Append the third column value to the result string
                    If result <> "" Then
                        result = result & Chr(10) & tblRow.Range.Cells(1, 3).Value
                    Else
                        result = tblRow.Range.Cells(1, 3).Value
                    End If
                    ' Exit the loop after the first match
                    Exit For
                End If
            Next tblRow
        Next line
        
        ' Write the result string to the corresponding cell in the destination range
        destRange.Cells(cell.Row - srcRange.Row + 1, cell.Column - srcRange.Column + 1).Value = result
    Next cell
End Sub
