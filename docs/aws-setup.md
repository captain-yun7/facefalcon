# AWS 설정 가이드

## 🌏 리전 선택

한국 사용자를 위해 **서울 리전(`ap-northeast-2`)**을 권장합니다:

### 서울 리전 장점
- ✅ **AWS Rekognition 지원** (2018년부터 지원)
- ✅ **빠른 응답속도** (낮은 레이턴시)
- ✅ **데이터 주권** (한국 내 데이터 처리)
- ✅ **비용 절감** (지역 간 전송 비용 없음)

### 지원되는 AWS Rekognition 기능 (서울 리전)
- Amazon Rekognition Image
- Amazon Rekognition Video  
- Amazon Rekognition Custom Labels

## S3 버킷 생성

### AWS CLI를 사용한 S3 버킷 생성

```bash
# 1. AWS CLI 설치 (Ubuntu/Debian)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 2. AWS CLI 설정
aws configure
# AWS Access Key ID: YOUR_ACCESS_KEY
# AWS Secret Access Key: YOUR_SECRET_KEY
# Default region name: ap-northeast-2  # 서울 리전 (권장)
# Default output format: json

# 3. S3 버킷 생성 (서울 리전 - 한국 사용자에게 최적)
aws s3 mb s3://facefalcon-images --region ap-northeast-2

# 4. 버킷 CORS 설정 (웹 애플리케이션 접근 허용)
aws s3api put-bucket-cors --bucket facefalcon-images --cors-configuration file://cors-config.json

# 5. 퍼블릭 액세스 차단 해제 (임시 이미지 접근용)
aws s3api put-public-access-block --bucket facefalcon-images --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# 6. 버킷 정책 설정 (읽기 전용 퍼블릭 액세스)
aws s3api put-bucket-policy --bucket facefalcon-images --policy file://bucket-policy.json

# 7. 생명주기 규칙 설정 (24시간 후 자동 삭제)
aws s3api put-bucket-lifecycle-configuration --bucket facefalcon-images --lifecycle-configuration file://lifecycle-config.json
```

## 필요한 설정 파일들

### cors-config.json
```json
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
```

### bucket-policy.json
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::facefalcon-images/*"
        }
    ]
}
```

### lifecycle-config.json
```json
{
    "Rules": [
        {
            "ID": "DeleteTemporaryImages",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "uploads/"
            },
            "Expiration": {
                "Days": 1
            }
        }
    ]
}
```

## IAM 사용자 권한 설정

### 필요한 IAM 정책

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::facefalcon-images/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "rekognition:CompareFaces",
                "rekognition:DetectFaces"
            ],
            "Resource": "*"
        }
    ]
}
```

### CLI로 IAM 정책 생성 및 연결

```bash
# 1. IAM 정책 생성
aws iam create-policy --policy-name FaceFalconPolicy --policy-document file://iam-policy.json

# 2. IAM 사용자 생성
aws iam create-user --user-name facefalcon-user

# 3. 정책을 사용자에게 연결
aws iam attach-user-policy --user-name facefalcon-user --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/FaceFalconPolicy

# 4. 액세스 키 생성
aws iam create-access-key --user-name facefalcon-user
```

## 버킷 확인 및 테스트

```bash
# 버킷 목록 확인
aws s3 ls

# 버킷 상세 정보 확인
aws s3api head-bucket --bucket facefalcon-images

# 테스트 파일 업로드
echo "test" > test.txt
aws s3 cp test.txt s3://facefalcon-images/test.txt

# 업로드된 파일 확인
aws s3 ls s3://facefalcon-images/

# 테스트 파일 삭제
aws s3 rm s3://facefalcon-images/test.txt
rm test.txt
```

## 트러블슈팅

### 1. 권한 오류
```bash
# 현재 사용자 확인
aws sts get-caller-identity

# 버킷 권한 확인
aws s3api get-bucket-policy --bucket facefalcon-images
```

### 2. 지역(Region) 오류
```bash
# 버킷 지역 확인
aws s3api get-bucket-location --bucket facefalcon-images

# 환경변수에서 AWS_REGION 확인
echo $AWS_REGION
```

### 3. 버킷 삭제 (필요시)
```bash
# 버킷 내 모든 객체 삭제
aws s3 rm s3://facefalcon-images --recursive

# 버킷 삭제
aws s3 rb s3://facefalcon-images
```

## 빠른 설정 스크립트

모든 설정을 자동화하려면 다음 스크립트를 사용하세요:

```bash
#!/bin/bash

# setup-aws.sh
BUCKET_NAME="facefalcon-images"
REGION="ap-northeast-2"  # 서울 리전

echo "Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

echo "Setting up CORS configuration..."
cat > cors-config.json << 'EOF'
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": []
        }
    ]
}
EOF

aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://cors-config.json

echo "Setting up lifecycle configuration..."
cat > lifecycle-config.json << 'EOF'
{
    "Rules": [
        {
            "ID": "DeleteTemporaryImages",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "uploads/"
            },
            "Expiration": {
                "Days": 1
            }
        }
    ]
}
EOF

aws s3api put-bucket-lifecycle-configuration --bucket $BUCKET_NAME --lifecycle-configuration file://lifecycle-config.json

echo "AWS S3 setup completed!"
echo "Bucket URL: https://$BUCKET_NAME.s3.$REGION.amazonaws.com"

# 설정 파일 정리
rm cors-config.json lifecycle-config.json
```

실행 방법:
```bash
chmod +x setup-aws.sh
./setup-aws.sh
```