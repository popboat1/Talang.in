import json

def join_jsons(file1_path, file2_path, output_path):
    # 1. Load the first JSON file
    with open(file1_path, 'r', encoding='utf-8') as f1:
        data1 = json.load(f1)
        
    # 2. Load the second JSON file
    with open(file2_path, 'r', encoding='utf-8') as f2:
        data2 = json.load(f2)
        
    # Capture the original lengths before modifying data1
    original_len_1 = len(data1)
    original_len_2 = len(data2)
        
    # 3. Combine the lists
    data1.extend(data2)
    
    # 4. Write the combined data to the explicitly provided output_path
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data1, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully joined {original_len_1} and {original_len_2} items. Total: {len(data1)}")

if __name__ == '__main__':
    join_jsons(
        'D:/Python/Talang.in/analytics/outputs/combined_dataset.json', 
        'D:/Python/Talang.in/analytics/outputs/addition2.json', 
        'D:/Python/Talang.in/analytics/outputs/final_dataset.json'
    )