Sub UpdateSubCatergories()
    Dim srcRange As Range
    Dim destRange As Range
    Dim tbl As ListObject
    Dim cell As Range
    Dim lines() As String
    Dim result As String
    Dim dict As Object
    Dim line As Variant
    Dim tblRow As ListRow
    Dim i As Long

    ' Set the ranges using named ranges
    Set srcRange = ThisWorkbook.Names("Search_Factors").RefersToRange
    Set destRange = ThisWorkbook.Names("Sub_Catergories").RefersToRange
    ' Set the table reference
    Set tbl = ThisWorkbook.Sheets("Search Data").ListObjects("Table5")

    ' Create a dictionary to store the matched values without duplicates
    Set dict = CreateObject("Scripting.Dictionary")

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
            ' Initialize a temporary string for matched solutions
            Dim matchedSolutions As String
            matchedSolutions = ""
            
            ' Loop through each row in the table
            For Each tblRow In tbl.ListRows
                ' Check if the line matches the value in the first column of the table
                If Trim(line) = Trim(tblRow.Range.Cells(1, 1).Value) Then
                    ' Append the second column value to the matched solutions
                    If matchedSolutions <> "" Then
                        matchedSolutions = matchedSolutions & Chr(10) & tblRow.Range.Cells(1, 4).Value
                    Else
                        matchedSolutions = tblRow.Range.Cells(1, 3).Value
                    End If
                End If
            Next tblRow
            
            ' Append matched solutions to the result string for the current cell
            If result <> "" Then
                result = result & Chr(10) & matchedSolutions
            Else
                result = matchedSolutions
            End If
        Next line
        
        ' Write the result string to the corresponding cell in the destination range
        destRange.Cells(cell.Row - srcRange.Row + 1, cell.Column - srcRange.Column + 1).Value = result
    Next cell
End Sub



