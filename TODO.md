1. When closing the application store current windows size & location into .config.json
2. When launching application check if windows size & location exists to open in the same place & size
3. When loading a File from menu, button or right click open with, store file name, path, date, time, action (open,closed,saved) in .history.json
3. When saving a file that was open rather than created ask before saving & overriding, then update .history.json
4. When saving a new created file store name, path, date, time, action (open,closed,saved) in .history.json
5. Create a Button with a pop-up window listing the history with a open button for each file that is listed in .history.json and exits