# datafairness-transform

이 Repository는 데이터 품질 평가기반 데이터 고도화 및 데이터셋 보정 기술 개발 국책과제의 구성 중 하나이며 데이터 정제 및 데이터 전처리를 목적으로 한다.

## 필요성 및 목적

최근 기업 활동의 다양한 영역에서 데이터는 끊임없이 발생하고 있고, 이렇게 수시로 발생하는 데이터는 품질이 낮고 불완전 할 수 있다.
이러한 데이터를 분석하고 가치를 창출하기 위해서는 데이터 표준화와 정제가 필요하다. 
해당 Repository는 많은 양의 데이터를 빠르고 효율적으로 정제, 분석 및 시각화 하는 것에 목적을 두었다.

## 방법 및 이론

## 실험
### OpenRefine 실행
1. 실행 및 Google Chrome을 통해 UI 접속. ( http://Server_IP:Port )
- ./refine
![Main view](https://user-images.githubusercontent.com/39294675/89847223-60a64500-dbbe-11ea-89f6-c7d229132fad.png)

### Project 생성
1. 샘플 데이터 다운로드 ( https://drive.google.com/file/d/0ByWzdp4ZR-JiZkF1NFpCbHVGR1U/view )
2. 데이터를 업로드하여, 새로운 프로젝트를 만들기 위해 “Create Project”를 클릭.
3. 데이터를 여러 위치 ( IRIS Database, Hadoop, This Computer, Web Addresses, Database, 직접입력 ) 에서 가져올 수 있음.
 
	3.1. This Computer

	- "this Computer" 클릭 -> "파일 선택" 클릭 (파일을 PC로부터 가져옴) -> "Next" 클릭
![Import Local](https://user-images.githubusercontent.com/39294675/89848344-14103900-dbc1-11ea-9058-6dd17d6e643c.png)
 
	3.2. Hadoop
	
	- "Hadoop" 클릭 -> Hadoop 파일 경로를 입력 -> "Next" 클릭
![Import Hadoop](https://user-images.githubusercontent.com/39294675/91256369-233add80-e7a2-11ea-8d5c-361bd38a912f.PNG)

	3.3. IRIS Database
	
	- "Database" 클릭 -> Type 항목을 IRISDB로 변경 후, 접속 관련 정보 입력 및 "Connect" 클릭
![Import IRIS Connect](https://user-images.githubusercontent.com/39294675/91256373-2635ce00-e7a2-11ea-84ef-721b2dae5e5c.PNG)

	- 쿼리 작성 -> "Preview Query Result" 클릭
![Import IRIS Query](https://user-images.githubusercontent.com/39294675/91256380-27ff9180-e7a2-11ea-86a6-38cb8d6850f1.PNG)

 4. 데이터의 미리 보기가 표시되고, 파일 형식에 따라 ( CSV, TSV, xls, JSON ) 설정을 변경 후 “Create Project” 클릭.
![Create Project](https://user-images.githubusercontent.com/39294675/89848364-17a3c000-dbc1-11ea-866c-6acc3a20e8b6.png)
 5. 프로젝트를 생성한 후에는 “Open Project” 탭을 클릭하여, 생성된 프로젝트를 열 수 있음.
![Open Project](https://user-images.githubusercontent.com/39294675/89848366-17a3c000-dbc1-11ea-84f2-c9ee858c6a9b.png)

### Export Data
1. hadoop

	- Project에 대한 정제 및 전처리 작업 후, 화면 오른쪽 상단의 "Export" 클릭 -> "Hadoop" 클릭
![export Hadoop](https://user-images.githubusercontent.com/39294675/91257121-0bfcef80-e7a4-11ea-9475-0385c6366c26.PNG)

	- hadoop 조회를 통해 해당 파일의 저장 여부 확인. (Project 명.csv 형태로 저장)
![export Hadoop ls](https://user-images.githubusercontent.com/39294675/91257126-0d2e1c80-e7a4-11ea-8bbc-2e6a37a030ad.PNG)

2. IRIS Database
	
	- Project에 대한 정제 및 전처리 작업 후, 화면 오른쪽 상단의 "Export" 클릭 -> "SQL Exporter..." 클릭
![Import SQL](https://user-images.githubusercontent.com/39294675/91266767-df99a100-e7ac-11ea-9379-5fd62d5bc3c1.PNG)

	- "Content" 탭 클릭 -> IRIS Partition Key/Date 입력
![Import SQL key](https://user-images.githubusercontent.com/39294675/91266762-de687400-e7ac-11ea-9e59-25ca9d7acb16.PNG)
	
	- "Download" 탭 클릭 -> Table Name 입력, Insert IRIS 체크, IRIS Database 정보 입력 -> "Download" 클릭
![Import SQL insert](https://user-images.githubusercontent.com/39294675/91266769-e0cace00-e7ac-11ea-9db9-073664fc312a.PNG)

	- IRIS DB 조회를 통해 해당 Table의 생성 및 데이터 삽입 여부 확인.
![Import SQL result](https://user-images.githubusercontent.com/39294675/91266768-e0323780-e7ac-11ea-857a-a75e1834802d.PNG)

### 데이터 품질 평가
1. "Data Quality Assessment" 클릭 -> project 선택 후, "Select" 클릭
![quality select](https://user-images.githubusercontent.com/39294675/91269444-1920db00-e7b2-11ea-8bd0-ee6fac75a623.PNG)

2. 오른쪽 상단의 "Select All" 체크 -> "Data statistics" 클릭
![quality result](https://user-images.githubusercontent.com/39294675/91269447-19b97180-e7b2-11ea-9979-70eb0cdc4287.PNG)

---

이 논문은 2020년도 정부(과학기술정보통신부)의 재원으로 정보통신기획평가원의 지원을 받아 수행된 연구임.

(No.2020-0-00512, 데이터 품질 평가기반 데이터 고도화 및 데이터셋 보정 기술 개발)

This work was supported by Institute of Information & communications Technology Planning & Evaluation(IITP) grant funded by the Korea government(MSIT)

(No.2020-0-00512, Data Refinment and Improvement through Data Quality Evaluation)

---
