package com.sinan.rentACar.business.concretes;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.business.abstracts.BrandService;
import com.sinan.rentACar.business.requests.CreateBrandRequest;
import com.sinan.rentACar.business.requests.UpdateBrandRequest;
import com.sinan.rentACar.business.responses.GetAllBrandsResponse;
import com.sinan.rentACar.business.responses.GetByIdBrandResponse;
import com.sinan.rentACar.business.rules.BrandBusinessRules;
import com.sinan.rentACar.core.utilities.mappers.ModelMapperService;
import com.sinan.rentACar.dataAccess.abstracts.BrandRepository;
import com.sinan.rentACar.entities.concretes.Brand;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class BrandManager  implements BrandService {
    private final BrandRepository brandRepository;
    private final ModelMapperService modelMapperService;
    private final BrandBusinessRules brandBusinessRules;

    @Override
    public List<GetAllBrandsResponse> getAll() {
        List<Brand> brands = this.brandRepository.findAll();
        List<GetAllBrandsResponse> getAllBrandsResponses = brands.stream()
        .map(brand -> this.modelMapperService.forResponse().map(brand, GetAllBrandsResponse.class))
        .collect(Collectors.toList());
        return getAllBrandsResponses;
    }

    @Override
    public GetByIdBrandResponse getById(int id) {
        Brand brand = this.brandRepository.findById(id).orElseThrow();
        return this.modelMapperService.forResponse().map(brand, GetByIdBrandResponse.class);
    }

    @Override
    public void add(CreateBrandRequest createBrandRequest) {
        this.brandBusinessRules.checkIfBrandNameExists(createBrandRequest.getName());
        Brand brand = this.modelMapperService.forRequest().map(createBrandRequest, Brand.class);
        this.brandRepository.save(brand);
    }

    @Override
    public void update(UpdateBrandRequest updateBrandRequest) {
        Brand existingBrand = this.brandRepository.findById(updateBrandRequest.getId()).orElseThrow();
        this.modelMapperService.forRequest().map(updateBrandRequest, existingBrand);
        this.brandRepository.save(existingBrand);
    }

    @Override
    public void delete(int id) {
        this.brandRepository.deleteById(id);
    }
   
}
