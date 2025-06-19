Sub ExtractUniqueGroups()
    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim columnData As Range
    Dim uniqueList As Object
    Dim cell As Range
    Dim arr As Variant
    Dim i As Long, j As Long
    Dim temp As String
    Dim val As String
    Dim outputTable As ListObject
    Dim newRow As ListRow

    ' Set the worksheet and tables
    Set ws = ThisWorkbook.Sheets("Glossary")   ' Change as needed
    Set tbl = ws.ListObjects("Table2")          ' Source table
    Set outputTable = ws.ListObjects("Table4")  ' Destination table

    ' Source column to extract from (3rd column)
    Set columnData = tbl.ListColumns(3).DataBodyRange

    ' Clear all existing rows in destination table except header
    On Error Resume Next
    Do While outputTable.ListRows.Count > 0
        outputTable.ListRows(1).Delete
    Loop
    On Error GoTo 0

    ' Create dictionary for unique values
    Set uniqueList = CreateObject("Scripting.Dictionary")

    ' Collect unique values with trimming and case normalization
    For Each cell In columnData
        val = Trim(cell.Value)
        If val <> "" Then
            val = LCase(val) ' Normalize for uniqueness
            If Not uniqueList.exists(val) Then
                uniqueList.Add val, cell.Value ' Store original casing for output
            End If
        End If
    Next cell

    ' Get unique values into an array
    arr = uniqueList.Items

    ' Sort array alphabetically (case-insensitive) inline
    For i = LBound(arr) To UBound(arr) - 1
        For j = i + 1 To UBound(arr)
            If StrComp(arr(i), arr(j), vbTextCompare) > 0 Then
                temp = arr(i)
                arr(i) = arr(j)
                arr(j) = temp
            End If
        Next j
    Next i

    ' Output sorted unique values into destination table
    For i = 0 To UBound(arr)
        Set newRow = outputTable.ListRows.Add
        newRow.Range.Cells(1, 1).Value = arr(i)
    Next i
End Sub

