Sub Glossary_CheckUniqueIssueGlossary()
    Dim ws1 As Worksheet
    Dim ws2 As Worksheet
    Dim sourceRange As Range
    Dim destTable As ListObject
    Dim destColumn As ListColumn
    Dim issue As Variant
    Dim issuesDict As Object
    Dim i As Long
    Dim outputRow As Long
    Dim existingissue As Variant

    ' Set the source worksheet
    Set ws1 = ThisWorkbook.Worksheets("Thermatic Analyisis")
    
    ' Set the destination worksheet
    Set ws2 = ThisWorkbook.Worksheets("Glossary")
    
    ' Set the source range using the named range "Issues"
    Set sourceRange = ws1.Range("Issues")
    
    ' Set the destination table (Table12)
    Set destTable = ws2.ListObjects("Table12")
    
    ' Delete all existing rows in the destination table
    If destTable.ListRows.Count > 0 Then
        For i = destTable.ListRows.Count To 1 Step -1
            destTable.ListRows(i).Delete
        Next i
    End If

    ' Create a dictionary to hold unique issues
    Set issuesDict = CreateObject("Scripting.Dictionary")
    
    ' Loop through each cell in the source range
    For Each cell In sourceRange
        If Len(cell.Value) > 0 Then
            ' Split the issues by new line
            Dim issueArray As Variant
            issueArray = Split(cell.Value, vbLf) ' Split by new line
            
            ' Loop through each issue and add to dictionary if unique
            For i = LBound(issueArray) To UBound(issueArray)
                issue = Trim(issueArray(i)) ' Trim whitespace
                If issue <> "" And Not issuesDict.Exists(issue) Then
                    issuesDict.Add issue, Nothing
                End If
            Next i
        End If
    Next cell
    
    ' Output unique issues to the destination table
    outputRow = 1 ' Start at row 1 of the destination table
    For Each issue In issuesDict.Keys
        ' Check if the issue is already in Table1, Column 1
        Dim found As Boolean
        found = False
        For Each existingissue In ws2.ListObjects("Table1").ListColumns(1).DataBodyRange
            If existingissue.Value = issue Then
                found = True
                Exit For
            End If
        Next existingissue
        
        ' Only add issue to the table if it is not found in Table1, Column 1
        If Not found Then
            destTable.ListRows.Add ' Add a new row to the table
            destTable.DataBodyRange(outputRow, 1).Value = issue ' Set the unique issue value
            outputRow = outputRow + 1
        End If
    Next issue
End Sub


