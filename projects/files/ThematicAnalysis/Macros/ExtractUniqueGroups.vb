Sub ExtractUniqueGroups()
    Dim ws As Worksheet
    Dim tbl As ListObject
    Dim outputTable As ListObject
    Dim columnData As Range
    Dim relatedData As Range
    Dim uniqueList As Object
    Dim i As Long
    Dim tempKey As String, tempVal As String
    Dim arrKeys As Variant, arrVals As Variant
    Dim newRow As ListRow
    Dim swapped As Boolean
    Dim j As Long
    Dim tempKeyStr As String
    Dim tempItem As Variant

    ' Set worksheet and tables
    Set ws = ThisWorkbook.Sheets("Glossary")   ' Change as needed
    Set tbl = ws.ListObjects("Table2")          ' Source table
    Set outputTable = ws.ListObjects("Table4")  ' Destination table

    ' Source columns to extract from
    Set columnData = tbl.ListColumns(2).DataBodyRange    ' Unique key column
    Set relatedData = tbl.ListColumns(3).DataBodyRange   ' Related value column (adjust if needed)

    ' Clear all existing rows in destination table except header
    On Error Resume Next
    Do While outputTable.ListRows.Count > 0
        outputTable.ListRows(1).Delete
    Loop
    On Error GoTo 0

    ' Create dictionary for unique keys, storing related value as dictionary item
    Set uniqueList = CreateObject("Scripting.Dictionary")

    ' Collect unique values with trimming and case normalization
    For i = 1 To columnData.Rows.Count
        tempKey = Trim(columnData.Cells(i, 1).Value)
        tempVal = relatedData.Cells(i, 1).Value
        If tempKey <> "" Then
            tempKey = LCase(tempKey) ' Normalize for uniqueness
            If Not uniqueList.Exists(tempKey) Then
                ' Store original casing key and related value as item in dictionary
                uniqueList.Add tempKey, Array(columnData.Cells(i, 1).Value, tempVal)
            End If
        End If
    Next i

    ' Extract keys and items for sorting
    arrKeys = uniqueList.Keys
    arrVals = uniqueList.Items

    ' Sort keys alphabetically (case-insensitive), and sort arrVals accordingly
    Do
        swapped = False
        For i = 0 To UBound(arrKeys) - 1
            If StrComp(arrKeys(i), arrKeys(i + 1), vbTextCompare) > 0 Then
                ' Swap keys
                tempKeyStr = arrKeys(i)
                arrKeys(i) = arrKeys(i + 1)
                arrKeys(i + 1) = tempKeyStr
                ' Swap corresponding items
                tempItem = arrVals(i)
                arrVals(i) = arrVals(i + 1)
                arrVals(i + 1) = tempItem
                swapped = True
            End If
        Next i
    Loop While swapped

    ' Output sorted unique keys and related values into destination table
    For i = 0 To UBound(arrKeys)
        Set newRow = outputTable.ListRows.Add
        newRow.Range.Cells(1, 1).Value = arrVals(i)(0) ' Original case key
        newRow.Range.Cells(1, 2).Value = arrVals(i)(1) ' Related value
    Next i

    ' --- Add totals row ---
    outputTable.ShowTotals = True
    outputTable.TotalsRowRange.Cells(1, 1).Value = "Total Rows:"
    outputTable.TotalsRowRange.Cells(1, 2).Value = outputTable.ListRows.Count

    ' Color totals row grey
    outputTable.TotalsRowRange.Interior.Color = RGB(128, 128, 128)

End Sub

