Sub Glossary_CheckUniqueFactorGlossary()
    Dim ws1 As Worksheet
    Dim ws2 As Worksheet
    Dim sourceRange As Range
    Dim destTable As ListObject
    Dim factor As Variant
    Dim factorsDict As Object
    Dim i As Long
    Dim outputRow As Long
    Dim existingfactor As Variant
    Dim cell As Range

    ' Set the source worksheet
    Set ws1 = ThisWorkbook.Worksheets("Thematic Analysis")
    
    ' Set the destination worksheet
    Set ws2 = ThisWorkbook.Worksheets("Glossary")
    
    ' Set the source range using the named range "Factors"
    Set sourceRange = ws1.Range("Factors")
    
    ' Set the destination table (Table3)
    Set destTable = ws2.ListObjects("Table3")
    
    ' Delete all existing rows in the destination table
    If destTable.ListRows.Count > 0 Then
        For i = destTable.ListRows.Count To 1 Step -1
            destTable.ListRows(i).Delete
        Next i
    End If

    ' Create a dictionary to hold unique factors
    Set factorsDict = CreateObject("Scripting.Dictionary")
    
    ' Loop through each cell in the source range
    For Each cell In sourceRange
        If Len(cell.Value) > 0 Then
            ' Split the factors by new line
            Dim factorArray As Variant
            factorArray = Split(cell.Value, vbLf) ' Split by new line
            
            ' Loop through each factor and add to dictionary if unique
            For i = LBound(factorArray) To UBound(factorArray)
                factor = Trim(factorArray(i)) ' Trim whitespace
                If factor <> "" And Not factorsDict.Exists(factor) Then
                    factorsDict.Add factor, Nothing
                End If
            Next i
        End If
    Next cell
    
    ' Output unique factors to the destination table
    outputRow = 1 ' Start at row 1 of the destination table
    For Each factor In factorsDict.Keys
        ' Check if the factor is already in Table2, Column 1
        Dim found As Boolean
        found = False
        For Each existingfactor In ws2.ListObjects("Table2").ListColumns(1).DataBodyRange
            If existingfactor.Value = factor Then
                found = True
                Exit For
            End If
        Next existingfactor
        
        ' Only add factor to the table if it is not found in Table2, Column 1
        If Not found Then
            destTable.ListRows.Add ' Add a new row to the table
            destTable.DataBodyRange(outputRow, 1).Value = factor ' Set the unique Factor value
            outputRow = outputRow + 1
        End If
    Next factor

    ' --- Add totals row ---
    destTable.ShowTotals = True
    destTable.TotalsRowRange.Cells(1, 1).Value = "Total Rows: " & destTable.ListRows.Count
    
    ' Clear other columns in the totals row (if any)
    Dim colIndex As Long
    For colIndex = 2 To destTable.ListColumns.Count
        destTable.TotalsRowRange.Cells(1, colIndex).Value = ""
    Next colIndex
    
    ' Color totals row darker grey
    destTable.TotalsRowRange.Interior.Color = RGB(128, 128, 128)

End Sub

