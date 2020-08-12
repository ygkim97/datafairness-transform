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
<img src="https://user-images.githubusercontent.com/39294675/89847223-60a64500-dbbe-11ea-89f6-c7d229132fad.png" width=700>

### Project 생성
1. 샘플 데이터 다운로드 ( https://drive.google.com/file/d/0ByWzdp4ZR-JiZkF1NFpCbHVGR1U/view )
2. 데이터를 업로드하여, 새로운 프로젝트를 만들기 위해 “Create Project”를 클릭.
3. 데이터를 여러 위치 ( Local, Web, Database, 직접입력 ) 에서 가져온 후 “Next”를 클릭.
 <img src="https://user-images.githubusercontent.com/39294675/89848344-14103900-dbc1-11ea-9058-6dd17d6e643c.png" width=700>
4. 데이터의 미리 보기가 표시되고, 파일 형식에 따라 ( CSV, TSV, xls, JSON ) 설정을 변경 후 “Create Project” 클릭.
 <img src="https://user-images.githubusercontent.com/39294675/89848364-17a3c000-dbc1-11ea-866c-6acc3a20e8b6.png" width=700>
5. 프로젝트를 생성한 후에는 “Open Project” 탭을 클릭하여, 생성된 프로젝트를 열 수 있음.
 <img src="https://user-images.githubusercontent.com/39294675/89848366-17a3c000-dbc1-11ea-84f2-c9ee858c6a9b.png" width=700>

---

이 논문은 2020년도 정부(과학기술정보통신부)의 재원으로 정보통신기획평가원의 지원을 받아 수행된 연구임.

(No.2020-0-00512, 데이터 품질 평가기반 데이터 고도화 및 데이터셋 보정 기술 개발)

This work was supported by Institute of Information & communications Technology Planning & Evaluation(IITP) grant funded by the Korea government(MSIT)

(No.2020-0-00512, Data Refinment and Improvement through Data Quality Evaluation)

---
