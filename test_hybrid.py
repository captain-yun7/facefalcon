#!/usr/bin/env python3
"""
하이브리드 시스템 통합 테스트
"""
import requests
import base64
import json
from PIL import Image
import io

def create_test_image(color='red', size=(200, 200)):
    """간단한 테스트 이미지 생성"""
    img = Image.new('RGB', size, color=color)
    buffer = io.BytesIO()
    img.save(buffer, format='JPEG')
    img_data = buffer.getvalue()
    return f"data:image/jpeg;base64,{base64.b64encode(img_data).decode()}"

def test_hybrid_status():
    """하이브리드 상태 테스트"""
    print("=== 하이브리드 상태 테스트 ===")
    try:
        response = requests.get("http://localhost:3000/api/hybrid/status")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"성공: {data['success']}")
            
            providers = data['data']['providers']
            config = data['data']['config']
            
            print(f"AWS 사용 가능: {providers['aws']['available']}")
            print(f"Python 사용 가능: {providers['python']['available']}")
            print(f"현재 설정: {config['provider']}")
            print(f"주 공급자: {config.get('primaryProvider', 'N/A')}")
            print("✅ 하이브리드 상태 확인 성공")
        else:
            print(f"❌ 상태 확인 실패: {response.text}")
    except Exception as e:
        print(f"❌ 오류: {e}")

def test_hybrid_face_comparison():
    """하이브리드 얼굴 비교 테스트"""
    print("\n=== 하이브리드 얼굴 비교 테스트 ===")
    try:
        # 두 개의 다른 색상 이미지
        img1 = create_test_image('blue')
        img2 = create_test_image('green')
        
        payload = {
            "sourceImage": img1,
            "targetImage": img2,
            "similarityThreshold": 1
        }
        
        response = requests.post(
            "http://localhost:3000/api/rekognition/compare-faces",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"성공: {data['success']}")
            if data.get('data'):
                similarity = data['data'].get('similarity', 0)
                print(f"유사도: {similarity:.3f}")
                print("✅ 하이브리드 얼굴 비교 성공")
            else:
                print("⚠️ 얼굴이 감지되지 않음 (정상 - 단순한 그림)")
        else:
            data = response.json()
            print(f"응답: {data}")
            
    except Exception as e:
        print(f"❌ 오류: {e}")

def test_hybrid_face_detection():
    """하이브리드 얼굴 감지 테스트"""
    print("\n=== 하이브리드 얼굴 감지 테스트 ===")
    try:
        test_img = create_test_image('yellow')
        
        payload = {"image": test_img}
        
        response = requests.post(
            "http://localhost:3000/api/rekognition/detect-faces",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"성공: {data['success']}")
            if data.get('data'):
                face_count = len(data['data'])
                print(f"감지된 얼굴 수: {face_count}")
                print("✅ 하이브리드 얼굴 감지 성공")
            else:
                print("⚠️ 얼굴이 감지되지 않음 (정상 - 단순한 그림)")
        else:
            data = response.json()
            print(f"응답: {data}")
            
    except Exception as e:
        print(f"❌ 오류: {e}")

def test_provider_config_change():
    """공급자 설정 변경 테스트"""
    print("\n=== 공급자 설정 변경 테스트 ===")
    try:
        # Python 전용으로 변경
        payload = {
            "action": "update-config",
            "config": {"provider": "python"}
        }
        
        response = requests.post(
            "http://localhost:3000/api/hybrid/status",
            json=payload
        )
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"설정 변경 성공: {data['success']}")
            new_config = data['data']['newConfig']
            print(f"새 설정: {new_config['provider']}")
            
            # 다시 하이브리드로 변경
            payload = {
                "action": "update-config", 
                "config": {"provider": "hybrid", "primaryProvider": "python"}
            }
            
            response = requests.post(
                "http://localhost:3000/api/hybrid/status",
                json=payload
            )
            
            if response.status_code == 200:
                print("✅ 설정 변경 테스트 성공")
            else:
                print("❌ 하이브리드 복원 실패")
        else:
            print(f"❌ 설정 변경 실패: {response.text}")
            
    except Exception as e:
        print(f"❌ 오류: {e}")

def main():
    """메인 테스트 실행"""
    print("🔗 하이브리드 얼굴 분석 시스템 통합 테스트\n")
    
    test_hybrid_status()
    test_hybrid_face_comparison()
    test_hybrid_face_detection()
    test_provider_config_change()
    
    print("\n✨ 하이브리드 통합 테스트 완료!")

if __name__ == "__main__":
    main()